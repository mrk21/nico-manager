require 'uri'
require 'nokogiri'

class User < ActiveRecord::Base
  has_one :session, primary_key: :niconico_id, dependent: :destroy
  has_many :mylists
  
  validates :niconico_id, presence: true, uniqueness: true
  
  TOP_URL = URI.parse('http://www.nicovideo.jp/my/mylist')
  
  def self.authenticate(params)
    session = Session.create_by_authenticating(params)
    return nil if session.nil?
    
    user = User.find_by(niconico_id: session.user_id)
    user = User.create!(niconico_id: session.user_id) if user.nil?
    user.fetch_profile
    user.fetch_mylist
    user.save
    user
  end
  
  def fetch_profile
    return self if self.session.nil?
    
    http = Net::HTTP.new(TOP_URL.host, TOP_URL.port)
    
    response = http.start do |http|
      uri = URI::Generic.build(path: TOP_URL.path, query: TOP_URL.query)
      req = Net::HTTP::Get.new(uri.to_s)
      req['Cookie'] = self.session.cookie
      http.request(req)
    end
    
    doc = Nokogiri::HTML.parse(response.body)
    img = doc.xpath('//div[@class="userDetail"]/div[@class="avatar"]/*/img')[0]
    uri = URI.parse(img.attribute('src').value)
    self.avatar = URI::HTTP.build(host: uri.host, path: uri.path)
    self.nickname = img.attribute('alt').value
    self
  end
  
  def fetch_mylist
    list = NicoApi::Deflist.new(self.session).list
    
    Mylist.create(
      user_id: self.id,
      
      entries_attributes: list.map{|entry| {
        item_type: entry['item_type'],
        item_id: entry['item_id'],
        created_time: Time.at(entry['create_time'].to_i),
        updated_time: Time.at(entry['update_time'].to_i),
        description: entry['description'],
        
        video_attributes: {
          video_id:       entry['item_data']['video_id'],
          title:          entry['item_data']['title'],
          thumbnail_url:  entry['item_data']['thumbnail_url'],
          
          group_type:     entry['item_data']['group_type'],
          watch_id:       entry['item_data']['watch_id'],
          is_deleting:    entry['item_data']['deleted'].to_i != 0,
          created_time:   Time.at(entry['item_data']['first_retrieve'].to_i),
          updated_time:   Time.at(entry['item_data']['update_time'].to_i),
          
          play_count:     entry['item_data']['view_counter'].to_i,
          mylist_count:   entry['item_data']['mylist_counter'].to_i,
          comment_count:  entry['item_data']['num_res'].to_i,
          seconds:        entry['item_data']['length_seconds'].to_i,
          latest_comment: entry['item_data']['last_res_body'],
        }
      }}
    )
  end
end

require 'uri'
require 'nokogiri'

class User < ActiveRecord::Base
  has_one :session, primary_key: :niconico_id, dependent: :destroy
  has_many :mylists
  
  validates :niconico_id, presence: true, uniqueness: true
  
  TOP_URL = URI.parse('http://www.nicovideo.jp/my/mylist')
  
  def self.authorize(mail, password)
    session = Session.create_by_authorizing(mail, password)
    return nil if session.nil?
    
    user = User.find_by(niconico_id: session.user_id)
    user = User.create!(niconico_id: session.user_id) if user.nil?
    user.fetch_profile
    user.fetch_mylist
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
      group_id: nil,
      entries_attributes: list.map{|entry| {
        video_attributes: {
          video_id: entry['item_data']['video_id'],
          title: entry['item_data']['title'],
          thumbnail_url: entry['item_data']['thumbnail_url']
        }
      }}
    )
  end
end

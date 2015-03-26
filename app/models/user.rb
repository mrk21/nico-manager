require 'uri'
require 'nokogiri'

class User < ActiveRecord::Base
  has_one :session, primary_key: :niconico_id, dependent: :destroy
  has_many :mylists, dependent: :destroy
  has_many :entries, through: :mylists
  has_many :videos, ->{uniq}, through: :entries
  has_many :tags, ->{ select('count(tags.id) as taggings_count, tags.id, tags.name').group('tags.id') }, through: :videos
  
  validates :niconico_id, presence: true, uniqueness: true
  
  TOP_URL = URI.parse('http://www.nicovideo.jp/my/mylist')
  
  def self.authenticate(params)
    session = Session.create_by_authenticating(params)
    return nil if session.nil?
    
    user = User.find_by(niconico_id: session.user_id)
    user = User.create!(niconico_id: session.user_id) if user.nil?
    user.fetch_profile
    user.fetch_mylist
    user.fetch_video_detail
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
    save_entries = lambda do |mylist, entries|
      entries.to_a.each do |entry|
        next if entry['item_type'].to_i != 0
        video_attributes = {
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
        video = Video.find_by(video_id: entry['item_data']['video_id'])
        
        if video.nil? then
          video = Video.create(video_attributes)
        else
          video.update(video_attributes)
        end
        
        entry_attributes = {
          mylist_id: mylist.id,
          video_id: video.id,
          
          item_type: entry['item_type'],
          item_id: entry['item_id'],
          created_time: Time.at(entry['create_time'].to_i),
          updated_time: Time.at(entry['update_time'].to_i),
          description: entry['description'],
        }
        entry = Entry.find_by(mylist_id: mylist.id, video_id: video.id)
        
        if entry.nil? then
          entry = Entry.create(entry_attributes)
        else
          entry.update(entry_attributes)
        end
      end
    end
    
    mylist = Mylist.find_by(user_id: self.id, group_id: nil)
    mylist = Mylist.create(user_id: self.id, group_id: nil) if mylist.nil?
    save_entries[mylist, NicoApi::Deflist.new(self.session).list]
    
    mylist_group_list = NicoApi::MylistGroup.new(self.session).list.to_a
    mylist_group_list.each do |group|
      group_attributes = {
        group_id: group['id'].to_i,
        user_id: self.id,
        name: group['name'],
        description: group['description'],
        is_public: group['public'].to_i != 0,
        sort_order: group['sort_order'].to_i,
        created_time: Time.at(group['create_time'].to_i),
        updated_time: Time.at(group['update_time'].to_i)
      }
      mylist = Mylist.find_by(user_id: self.id, group_id: group['id'].to_i)
      
      if mylist.nil? then
        mylist = Mylist.create(group_attributes)
      else
        mylist.update(group_attributes)
      end
      
      save_entries[mylist, NicoApi::Mylist.new(self.session, mylist.group_id).list]
    end
  end
  
  def fetch_video_detail
    self.videos.find_in_batches(batch_size: 20) do |videos|
      videos = Hash[*videos.map{|r| [r.video_id, r]}.flatten]
      details = NicoApi::VideoArray.new.get(videos.keys)
      details.to_a.each do |detail|
        video = videos[detail['video']['id']]
        video.description = detail['video']['description']
        detail['tags']['tag_info'].to_a.each do |tag|
          case tag
          when Hash then
            video.tag_list.add(tag['tag'])
          else
            video.tag_list.add(tag.to_s)
          end
        end
        video.save
      end
      sleep 0.2
    end
  end
end

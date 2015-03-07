require 'uri'
require 'nokogiri'

class User < ActiveRecord::Base
  has_one :session, primary_key: :niconico_id
  
  validates :niconico_id, presence: true, uniqueness: true
  
  TOP_URL = URI.parse('http://www.nicovideo.jp/my/mylist')
  
  def self.authorize(mail, password)
    session = Session.create_by_authorizing(mail, password)
    user = User.create(niconico_id: session.user_id)
    user.fetch_profile
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
end

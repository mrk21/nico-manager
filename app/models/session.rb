require 'net/https'
require 'uri'
require 'webrick/cookie'
require 'nokogiri'

class Session < ActiveRecord::Base
  belongs_to :user, primary_key: :niconico_id
  
  validates :user_id, presence: true, uniqueness: true
  validates :cookie, presence: true
  validates :api_token, presence: true
  
  LOGIN_URL = URI.parse('https://secure.nicovideo.jp/secure/login?site=niconico')
  LOGGEDIN_URL = 'http://www.nicovideo.jp/'
  MYLIST_URL = URI.parse('http://www.nicovideo.jp/my/mylist')
  
  def self.create_by_authorizing(mail, password)
    https = Net::HTTP.new(LOGIN_URL.host, LOGIN_URL.port)
    https.use_ssl = true
    https.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
    response = https.start do |https|
      uri = URI::Generic.build(path: LOGIN_URL.path, query: LOGIN_URL.query)
      data = URI.encode_www_form(mail: mail, password: password)
      https.post(uri.to_s, data)
    end
    
    return nil unless response['Location'] == LOGGEDIN_URL
    
    cookie = self.get_cookie(response)
    api_token = self.get_api_token(cookie)
    user_id = self.get_user_id(api_token)
    
    old_session = self.find_by(user_id: user_id)
    old_session.destroy unless old_session.nil?
    self.create!(user_id: user_id, cookie: cookie, api_token: api_token)
  end
  
  protected
  
  def self.get_cookie(response)
    cookies = response.get_fields('Set-Cookie').map{|c| WEBrick::Cookie.parse_set_cookie(c)}
    cookies.delete_if{|c| c.expires < Time.now}
    cookies.map{|c| [c.name, c.value].join('=')}.join('; ')
  end
  
  def self.get_api_token(cookie)
    http = Net::HTTP.new(MYLIST_URL.host, MYLIST_URL.port)
    
    response = http.start do |http|
      uri = URI::Generic.build(path: MYLIST_URL.path, query: MYLIST_URL.query)
      req = Net::HTTP::Get.new(uri.to_s)
      req['Cookie'] = cookie
      http.request(req)
    end
    
    doc = Nokogiri::HTML.parse(response.body)
    doc.xpath('//script[not(@src)][@type="text/javascript"]').map do |node|
      node.to_s.match('^\s*NicoAPI.token.*$').to_s.gsub(/[\s"';]/,'').gsub('NicoAPI.token=','')
    end.join
  end
  
  def self.get_user_id(api_token)
    api_token.to_s.split('-')[0]
  end
end

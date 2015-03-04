require 'net/https'
require 'uri'
require 'webrick/cookie'

class NicoVideo::Session < ActiveRecord::Base
  validates :mail, presence: true
  
  LOGIN_URL = URI.parse('https://secure.nicovideo.jp/secure/login?site=niconico')
  LOGGEDIN_URL = 'http://www.nicovideo.jp/'
  
  def authorize(password)
    https = Net::HTTP.new(LOGIN_URL.host, LOGIN_URL.port)
    https.use_ssl = true
    https.verify_mode = OpenSSL::SSL::VERIFY_NONE
    
    response = https.start do |https|
      uri = URI::Generic.build(path: LOGIN_URL.path, query: LOGIN_URL.query)
      data = URI.encode_www_form(mail: self.mail, password: password)
      https.post(uri.to_s, data)
    end
    
    if response['Location'] == LOGGEDIN_URL then
      cookies = response.get_fields('Set-Cookie').map{|c| WEBrick::Cookie.parse_set_cookie(c)}
      cookies.delete_if{|c| c.expires < Time.now}
      self.cookie = cookies.map{|c| [c.name, c.value].join('=')}.join('; ')
    else
      self.cookie = nil
    end
  end
end

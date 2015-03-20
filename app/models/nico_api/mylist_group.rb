require 'net/http'
require 'uri'
require 'json'

class NicoApi::MylistGroup
  LIST_URL = URI.parse('http://www.nicovideo.jp/api/mylistgroup/list')
  
  def initialize(session)
    @session = session
  end
  
  def list
    http = Net::HTTP.new(LIST_URL.host, LIST_URL.port)
    
    response = http.start do |http|
      uri = URI::Generic.build(path: LIST_URL.path, query: LIST_URL.query)
      req = Net::HTTP::Get.new(uri.to_s)
      req['Cookie'] = @session.cookie
      http.request(req)
    end
    
    JSON.parse(response.body)['mylistgroup']
  end
end

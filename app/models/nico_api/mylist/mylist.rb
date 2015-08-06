require 'net/http'
require 'uri'
require 'json'

class NicoApi::Mylist::Mylist
  LIST_URL = URI.parse('http://www.nicovideo.jp/api/mylist/list')
  
  def initialize(session, group_id)
    @session = session
    @group_id = group_id
  end
  
  def list
    http = Net::HTTP.new(LIST_URL.host, LIST_URL.port)
    
    response = http.start do |http|
      query = URI.decode_www_form(LIST_URL.query || '')
      query.push(['group_id', @group_id])
      uri = URI::Generic.build(path: LIST_URL.path, query: URI.encode_www_form(query))
      req = Net::HTTP::Get.new(uri.to_s)
      req['Cookie'] = @session.cookie
      http.request(req)
    end
    
    JSON.parse(response.body)['mylistitem']
  end
end

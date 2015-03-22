require 'net/http'
require 'uri'

class NicoApi::VideoArray
  BASE_URL = URI.parse('http://i.nicovideo.jp/v3/video.array')
  
  def get(video_ids)
    http = Net::HTTP.new(BASE_URL.host, BASE_URL.port)
    
    response = http.start do |http|
      query = URI.decode_www_form(BASE_URL.query || '')
      query.push(['v', video_ids.join(',')])
      uri = URI::Generic.build(path: BASE_URL.path, query: URI.encode_www_form(query))
      req = Net::HTTP::Get.new(uri.to_s)
      http.request(req)
    end
    
    Hash.from_xml(response.body)['nicovideo_video_response']['video_info']
  end
end

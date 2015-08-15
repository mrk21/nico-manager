require 'net/http'
require 'uri'

class NicoApi::Ext::Getthumbinfo
  BASE_URL = URI.parse('http://ext.nicovvideo_ideo.jp/api/getthumbinfo')
  
  def get(video_id)
    http = Net::HTTP.new(BASE_URL.host, BASE_URL.port)
    
    response = http.start do |http|
      uri = URI::Generic.build(path: File.join(BASE_URL.path, video_id))
      req = Net::HTTP::Get.new(uri.to_s)
      http.request(req)
    end
    
    begin
      result = Hash.from_xml(response.body)['nicovideo_thumb_response']
      
      case result['status']
      when 'ok' then
        result['thumb']
      when 'fail' then
        Rails.logger.warn(result['error'].inspect)
        nil
      end
    rescue => e
      Rails.logger.err([e, e.backtrace].compact.join("\n"))
      nil
    end
  end
end

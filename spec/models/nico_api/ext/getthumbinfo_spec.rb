require 'rails_helper'

RSpec.describe NicoApi::Ext::Getthumbinfo, type: :model do
  describe '#get()' do
    let(:video_id){ 'sm9' }
    let(:xml){ File.read('spec/fixtures/nico_api_ext_getthumbinfo/ok_sm9.xml') }
    
    before do
      stub_request(:get, ['http://ext.nicovideo.jp/api/getthumbinfo', self.video_id].join('/'))
        .to_return(status: 200, body: self.xml)
    end
    
    subject { NicoApi::Ext::Getthumbinfo.new.get(self.video_id) }
    
    it 'should be detail information of the specified video' do
      is_expected.to eq Hash.from_xml(self.xml)['nicovideo_thumb_response']['thumb']
    end
    
    context 'when occured errors' do
      let(:video_id){ 'sm8' }
      let(:xml){ File.read('spec/fixtures/nico_api_ext_getthumbinfo/error_sm8.xml') }
      it { is_expected.to be_nil }
    end
  end
end

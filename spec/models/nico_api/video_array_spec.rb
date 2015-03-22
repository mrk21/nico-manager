require 'rails_helper'
require 'yaml'

RSpec.describe NicoApi::VideoArray, type: :model do
  describe '#get(video_ids)' do
    let(:video_ids){['sm25781587','sm24189468']}
    let(:fixture_path){"spec/fixtures/video_array/ok_#{self.video_ids.join('_')}"}
    let(:response){          File.read self.fixture_path + '.xml'}
    let(:expected){YAML.load File.read self.fixture_path + '.yml'}
    
    before do
      stub_request(:get, "http://i.nicovideo.jp/v3/video.array?v=#{self.video_ids.join(',')}")
        .to_return(status: 200, body: response)
    end
    
    subject { NicoApi::VideoArray.new.get(self.video_ids) }
    
    it 'should be video details' do
      is_expected.to eq self.expected
    end
  end
end

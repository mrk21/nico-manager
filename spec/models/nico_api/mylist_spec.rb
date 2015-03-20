require 'rails_helper'

RSpec.describe NicoApi::Mylist, type: :model do
  describe 'list' do
    let(:session){ FactoryGirl.build :session }
    let(:json){ File.read('spec/fixtures/nico_api_mylist/ok.json') }
    
    before do
      stub_request(:get, "http://www.nicovideo.jp/api/mylist/list?group_id=12")
        .with(headers: {
          'Cookie'=> self.session.cookie
        })
        .to_return(status: 200, body: json)
    end
    
    subject { NicoApi::Mylist.new(self.session, 12).list }
    
    it 'should be mylist items' do
      is_expected.to eq JSON.parse(self.json)['mylistitem']
    end
    
    context 'when occured errors' do
      let(:json){ File.read('spec/fixtures/nico_api_mylist/error.json') }
      it { is_expected.to be_nil }
    end
  end
end

require 'rails_helper'

RSpec.describe NicoApi::Deflist, type: :model do
  describe 'list' do
    let(:session){ FactoryGirl.build :session }
    let(:json){ File.read('spec/fixtures/nico_api_deflist/ok.json') }
    
    before do
      stub_request(:get, 'http://www.nicovideo.jp/api/deflist/list')
        .with(headers: {
          'Cookie'=> self.session.cookie
        })
        .to_return(status: 200, body: json)
    end
    
    subject { NicoApi::Deflist.new(self.session).list }
    
    it 'should be mylist items' do
      is_expected.to eq JSON.parse(self.json)['mylistitem']
    end
    
    context 'when occured errors' do
      let(:json){ File.read('spec/fixtures/nico_api_deflist/error.json') }
      it { is_expected.to be_nil }
    end
  end
end

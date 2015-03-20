require 'rails_helper'

RSpec.describe User, type: :model do
  describe '::authenticate(params)' do
    let(:session){ FactoryGirl.create :session }
    let(:auth){{mail: 'user_hoge@example.com', password: 'pass'}}
    subject { User.authenticate self.auth }
    
    before do
      allow(Session).to receive_messages(create_by_authenticating: self.session)
      allow_any_instance_of(User).to receive(:fetch_profile)
      allow_any_instance_of(User).to receive(:fetch_mylist)
    end
    
    it 'should be user' do
      expect(subject.niconico_id).to eq session.user_id
    end
    
    context 'when the user not existed' do
      let(:session){ FactoryGirl.build :session }
      
      it 'should create the user' do
        expect(subject.niconico_id).to eq session.user_id
      end
    end
    
    context 'when authrization failed' do
      let(:session){}
      
      it { is_expected.to be_nil }
    end
  end
  
  describe '#fetch_profile()' do
    let(:user){ FactoryGirl.create(:session).user }
    let(:expected_nickname){'hoge'}
    let(:expected_avatar){"http://usericon.nimg.jp/usericon/123/#{self.user.id}.jpg"}
    let(:stub){
      stub_request(:get, 'http://www.nicovideo.jp/my/mylist')
        .with(headers: {
          'Cookie'=> self.user.session.cookie
        })
        .to_return(body: %[
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
          <html>
          <head>
          </head>
          <body>
            <div class="userDetail">
              <div class="avatar">
                <a href="http://www.nicovideo.jp/edit_icon">
                  <img src="#{self.expected_avatar}?1111111111" alt="#{self.expected_nickname}" />
                </a>
              </div>
            </div>
          </body>
          </html>
        ])
    }
    
    subject { self.user.fetch_profile }
    before { self.stub }
    
    it 'should set the user nickname' do
      expect(subject.nickname).to eq self.expected_nickname
    end
    
    it 'should set the user avatar' do
      expect(subject.avatar).to eq self.expected_avatar
    end
    
    context 'when this session not existed' do
      let(:user){ FactoryGirl.build :user }
      let(:stub){}
      
      it 'should not do' do
        expect{subject}.not_to raise_error
      end
    end
  end
  
  describe '#fetch_mylist()' do
    let(:mylist){ FactoryGirl.build :mylist }
    let(:mylist_2){ FactoryGirl.build :mylist_2 }
    let(:user) { self.mylist.user }
    let(:video){ FactoryGirl.build :video }
    let(:deflist_data){ JSON.parse(File.read('spec/fixtures/nico_api_deflist/ok.json'))['mylistitem'] }
    let(:mylistgroup_data){ JSON.parse(File.read('spec/fixtures/nico_api_mylist_group/ok.json'))['mylistgroup'] }
    
    before do
      allow_any_instance_of(NicoApi::Deflist).to receive_messages(list: self.deflist_data)
      allow_any_instance_of(NicoApi::MylistGroup).to receive_messages(list: self.mylistgroup_data)
      self.user.fetch_mylist
    end
    
    it 'should create mylist' do
      expect(Mylist.all.map{|r| r.dup.attributes}).to eq [
        self.mylist.attributes,
        self.mylist_2.attributes
      ]
    end
    
    it 'should create videos' do
      expect(Video.all.map{|r| r.dup.attributes}).to eq [self.video.attributes]
    end
    
    context 'when updating entries of the mylist' do
      let(:video_2){ FactoryGirl.build :video_2 }
      let(:data_2){ JSON.parse(File.read('spec/fixtures/nico_api_deflist/ok_2.json'))['mylistitem'] }
      
      before do
        allow_any_instance_of(NicoApi::Deflist).to receive_messages(list: self.data_2)
        self.user.fetch_mylist
      end
      
      it 'should create mylist' do
        expect(Mylist.all.map{|r| r.dup.attributes}).to eq [
          self.mylist.attributes,
          self.mylist_2.attributes
        ]
      end
      
      it 'should create videos' do
        expect(Video.all.map{|r| r.dup.attributes}).to eq [self.video.attributes, self.video_2.attributes]
      end
    end
  end
end

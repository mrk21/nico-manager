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
      allow_any_instance_of(User).to receive(:fetch_video_detail)
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
    let(:user) { self.mylist.user }
    let(:video){ FactoryGirl.build :video }
    let(:deflist_data){ JSON.parse(File.read('spec/fixtures/nico_api_deflist/ok.json'))['mylistitem'] }
    let(:mylistgroup_data){}
    let(:mylist_data){}
    
    before do
      allow_any_instance_of(NicoApi::Mylist::Deflist).to receive_messages(list: self.deflist_data)
      allow_any_instance_of(NicoApi::Mylist::MylistGroup).to receive_messages(list: self.mylistgroup_data)
      allow_any_instance_of(NicoApi::Mylist::Mylist).to receive_messages(list: self.mylist_data)
      self.user.fetch_mylist
    end
    
    it 'should create mylist' do
      expect(Mylist.all.map{|r| r.dup.attributes}).to eq [self.mylist.attributes]
    end
    
    it 'should create videos' do
      expect(Video.all.map{|r| r.dup.attributes}).to eq [self.video.attributes]
    end
    
    context 'when data were mixed a non video item' do
      let(:video){ FactoryGirl.build :video }
      let(:deflist_data){ JSON.parse(File.read('spec/fixtures/nico_api_deflist/ok_with_non_video_item.json'))['mylistitem'] }
      
      it 'should create mylist' do
        expect(Mylist.all.map{|r| r.dup.attributes}).to eq [self.mylist.attributes]
      end
      
      it 'should create videos' do
        expect(Video.all.map{|r| r.dup.attributes}).to eq [self.video.attributes]
      end
    end
    
    context 'with other mylist' do
      let(:mylist_2){ FactoryGirl.build :mylist_2 }
      let(:video_3){ FactoryGirl.build :video_3 }
      
      let(:mylistgroup_data){ JSON.parse(File.read('spec/fixtures/nico_api_mylist_group/ok.json'))['mylistgroup'] }
      let(:mylist_data){ JSON.parse(File.read('spec/fixtures/nico_api_mylist/ok.json'))['mylistitem'] }
      
      it 'should create mylist' do
        expect(Mylist.all.map{|r| r.dup.attributes}).to eq [
          self.mylist.attributes,
          self.mylist_2.attributes
        ]
      end
      
      it 'should create videos' do
        expect(Video.all.map{|r| r.dup.attributes}).to eq [
          self.video.attributes,
          self.video_3.attributes
        ]
      end
    end
    
    context 'when updating entries of the mylist' do
      let(:video_2){ FactoryGirl.build :video_2 }
      let(:deflist_data_2){ JSON.parse(File.read('spec/fixtures/nico_api_deflist/ok_2.json'))['mylistitem'] }
      
      before do
        allow_any_instance_of(NicoApi::Mylist::Deflist).to receive_messages(list: self.deflist_data_2)
        self.user.fetch_mylist
      end
      
      it 'should create mylist' do
        expect(Mylist.all.map{|r| r.dup.attributes}).to eq [self.mylist.attributes]
      end
      
      it 'should create videos' do
        expect(Video.all.map{|r| r.dup.attributes}).to eq [self.video.attributes, self.video_2.attributes]
      end
    end
  end
  
  describe '#fetch_video_detail()' do
    let(:video_ids){['sm9','sm1097445']}
    let(:fixture_paths){self.video_ids.map{|vid| "spec/fixtures/nico_api_ext_getthumbinfo/ok_#{vid}"}}
    let(:data){self.fixture_paths.map{|path| Hash.from_xml(File.read "#{path}.xml")['nicovideo_thumb_response']['thumb']}}
    
    let(:user) do
      FactoryGirl.create(:user_template, mylists_params: [
        entries_params: self.video_ids.map{|vid|
          {video_params: {video_id: vid}}
        }
      ])
    end
    
    before do
      self.data.each do |v|
        allow_any_instance_of(NicoApi::Ext::Getthumbinfo).to receive(:get).with(v['video_id']).and_return(v)
      end
      
      self.user.fetch_video_detail
      self.user.videos.reload
    end
    
    it 'should set tags to this videos' do
      actual = self.user.videos.map{|v| v.tags.map(&:name)}.flatten
      expected = self.data.map{|v| v['tags']['tag']}.flatten
      expect(actual).to contain_exactly *expected
    end
    
    it 'should set description to this video' do
      actual = self.user.videos.map(&:description).flatten
      expected = self.data.map{|v| v['description']}.flatten
      expect(actual).to contain_exactly *expected
    end
  end
  
  describe '#tags' do
    user_traits = [:user_template, mylists_params: [
      entries_params: [{
        video_params: {tag_list: ['a']}
      }]
    ]]
    
    let(:user){ FactoryGirl.create *user_traits }
    let(:other_user){ FactoryGirl.create *user_traits }
    let(:expected){
      [{"id"=>nil, "name"=>"a", "taggings_count"=>1}]
    }
    
    before do
      self.user
      self.other_user
    end
    
    subject { self.user.tags.map{|c| c.dup.attributes} }
    
    it 'should be tags of this user' do
      is_expected.to eq self.expected
    end
  end
end

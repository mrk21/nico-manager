require 'rails_helper'

RSpec.describe NicoVideo::Session, type: :model do
  let(:set_cookie) do
    [
      'nicosid=1234567890.123456789; expires=Sat, 01-Mar-2025 12:44:38 GMT; path=/; domain=.nicovideo.jp',
      'user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT',
      'user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/',
      'user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp',
      'user_session=user_session_1111111111111111111111111111111111111111111111111111111111111111111111111; expires=Fri, 03-Apr-2015 12:44:39 GMT; path=/; domain=.nicovideo.jp',
      'repair_history=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp',
    ]
  end
  
  let(:cookie) do
    'nicosid=1234567890.123456789; user_session=user_session_1111111111111111111111111111111111111111111111111111111111111111111111111'
  end
  
  describe '#authorize(password)' do
    let(:stub) do
      stub_request(:post, 'https://secure.nicovideo.jp/secure/login?site=niconico')
        .with(body: /password=pass/)
        .to_return(status: 302, headers: {
          'Location'=> 'http://www.nicovideo.jp/',
          'Set-Cookie'=> self.set_cookie
        })
    end
    
    before { self.stub }
    
    it 'should set this cookie' do
      session = FactoryGirl.build(:nico_video_session)
      session.authorize('pass')
      expect(session.cookie).to eq(self.cookie)
    end
    
    context 'when this cookie set already' do
      it 'should reset this cookie' do
        session = FactoryGirl.build(:nico_video_session_with_cookie)
        session.authorize('pass')
        expect(session.cookie).to eq(self.cookie)
      end
    end
    
    context 'when authorization failed' do
      let(:stub) do
        stub_request(:post, 'https://secure.nicovideo.jp/secure/login?site=niconico')
          .with(body: /password=pass/)
          .to_return(status: 302, headers: {
            'Location'=> 'https://account.nicovideo.jp/login?site=niconico'
          })
      end
      
      it 'should clear this cookie' do
        session = FactoryGirl.build(:nico_video_session_with_cookie)
        session.authorize('pass')
        expect(session.cookie).to be_nil
      end
    end
  end
end

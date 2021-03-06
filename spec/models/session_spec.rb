require 'rails_helper'
require 'uri'
require 'webrick/cookie'

RSpec.describe Session, type: :model do
  describe '::create_by_authenticating(params)' do
    let(:expected){ FactoryGirl.build :session }
    let(:cookies){ WEBrick::Cookie.parse self.expected.cookie }
    let(:set_cookie) do
      expires = ->(time){ (Time.now.gmtime + time).strftime('%a, %d-%b-%Y %H:%M:%S %Z') }
      [
        "#{self.cookies[0]}; expires=#{expires[10.years]}; path=/; domain=.nicovideo.jp",
        "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT",
        "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/",
        "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp",
        "#{self.cookies[1]}; expires=#{expires[1.month]}; path=/; domain=.nicovideo.jp",
        "repair_history=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp",
      ]
    end
    let(:auth){{mail: 'user_hoge@example.com', password: 'pass'}}
    
    let(:stub) do
      stub_request(:post, 'https://secure.nicovideo.jp/secure/login?site=niconico')
        .with(body: URI.encode_www_form(self.auth))
        .to_return(status: 302, headers: {
          'Location'=> 'http://www.nicovideo.jp/',
          'Set-Cookie'=> self.set_cookie
        })
      stub_request(:get, 'http://www.nicovideo.jp/my/mylist')
        .with(headers: {
          'Cookie'=> self.expected.cookie
        })
        .to_return(body: %[
          <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
          <head>
          </head>
          <html>
            <script type="text/javascript"><!--
              NicoAPI.token = "#{self.expected.api_token}";
            --></script>
          </html>
        ])
    end
    
    before { self.stub }
    subject { Session.create_by_authenticating self.auth }
    
    it 'should be a new session' do
      actual_attributes = subject.attributes
      actual_attributes['id'] = nil
      expect(actual_attributes).to eq self.expected.attributes
    end
    
    it 'should be saved to database' do
      expect(subject.new_record?).to be_falsy
    end
    
    context 'when a session having a user_id of new session existed' do
      before { FactoryGirl.create :session, api_token: "a" }
      
      it 'should create a new session after deletes the session' do
        actual_attributes = subject.attributes
        actual_attributes['id'] = nil
        expect(actual_attributes).to eq self.expected.attributes
      end
    end
    
    context 'when authorization failed' do
      let(:stub) do
        stub_request(:post, 'https://secure.nicovideo.jp/secure/login?site=niconico')
          .with(body: URI.encode_www_form(self.auth))
          .to_return(status: 302, headers: {
            'Location'=> 'https://account.nicovideo.jp/login?site=niconico'
          })
      end
      
      it { is_expected.to be_nil }
    end
  end
end

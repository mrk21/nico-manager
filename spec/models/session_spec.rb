require 'rails_helper'
require 'uri'
require 'webrick/cookie'

RSpec.describe Session, type: :model do
  describe '::create_by_authorizing(mail, password)' do
    let(:expected){ FactoryGirl.build :session }
    let(:cookies){ WEBrick::Cookie.parse self.expected.cookie }
    let(:set_cookie){[
      "#{cookies[0]}; expires=Sat, 01-Mar-2025 12:44:38 GMT; path=/; domain=.nicovideo.jp",
      "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT",
      "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/",
      "user_session=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp",
      "#{cookies[1]}; expires=Fri, 03-Apr-2015 12:44:39 GMT; path=/; domain=.nicovideo.jp",
      "repair_history=deleted; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.nicovideo.jp",
    ]}
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
    subject { Session.create_by_authorizing self.auth[:mail], self.auth[:password] }
    
    it 'should be a new session' do
      is_expected.to eq self.expected
    end
    
    it 'should be saved to database' do
      expect(subject.new_record?).to be_falsy
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

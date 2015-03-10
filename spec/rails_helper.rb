ENV['RAILS_ENV'] ||= 'test'
require 'spec_helper'
require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'

ActiveRecord::Migration.maintain_test_schema!


module AuthenticationMacros
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  module ClassMethods
    def define_authenticated_stub(&user_block)
      let(:authenticated_stub) do
        allow(User).to receive_messages(authenticate: self.instance_eval(&user_block))
      end
    end
  end
end

module RequestMacros
  def self.included(base)
    base.extend(ClassMethods)
  end
  
  module ClassMethods
    def authenticated_context(*user_traits, &block)
      context('with authentication'){
        let(:current_user){ FactoryGirl.create(:user) }
        
        define_authenticated_stub { self.current_user }
        
        before do
          self.authenticated_stub
          
          post '/api/session', auth: {
            mail: 'hoge@fuga.com',
            password: 'pass'
          }
        end
      }.class_eval &block
      
      context 'without authentication' do
        it 'should be error response' do
          is_expected.to eq 400
          expect(body).to be_json_eql('Authentication error'.to_json).at_path('message')
        end
      end
    end
  end
end


RSpec.configure do |config|
  config.fixture_path = "#{::Rails.root}/spec/fixtures"
  config.use_transactional_fixtures = true
  config.infer_spec_type_from_file_location!
  
  config.include JsonSpec::Helpers
  config.include RSpec::RequestDescriber, type: :request
  config.include AuthenticationMacros
  config.include RequestMacros, type: :request
  
  config.before :all do
    FactoryGirl.reload
  end
  
  config.before :suite do
    DatabaseRewinder.clean_all
  end
  
  config.after :each do
    DatabaseRewinder.clean
  end
end

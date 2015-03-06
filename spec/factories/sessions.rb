FactoryGirl.define do
  factory :session do
    user_id { FactoryGirl.build(:user).id }
    cookie {"nicosid=1111111111.111111111; user_session=user_session_#{user_id}_1111111111111111111111111111111111111111111111111111111111111111"}
    api_token {"#{user_id}-1111111111-1111111111111111111111111111111111111111"}
    
    factory :session_of_after_creating_user do
      user_id { FactoryGirl.create(:user).id }
    end
  end
end

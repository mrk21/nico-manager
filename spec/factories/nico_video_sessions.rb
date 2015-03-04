FactoryGirl.define do
  factory :nico_video_session, :class => 'NicoVideo::Session' do
    mail 'user_hoge@example.com'
  end
  
  factory :nico_video_session_with_cookie, :class => 'NicoVideo::Session' do
    mail 'user_hoge@example.com'
    cookie 'nicosid=1111111111.111111111; user_session=user_session_2222222222222222222222222222222222222222222222222222222222222222222222222'
  end
end

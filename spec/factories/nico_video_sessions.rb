FactoryGirl.define do
  factory :nico_video_session, :class => 'NicoVideo::Session' do
    id 123
    cookie {"nicosid=1111111111.111111111; user_session=user_session_#{id}_1111111111111111111111111111111111111111111111111111111111111111"}
    api_token {"#{id}-1111111111-1111111111111111111111111111111111111111"}
  end
end

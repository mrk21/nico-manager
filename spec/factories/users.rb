FactoryGirl.define do
  factory :user do
    niconico_id 123
  end
  
  factory :user_template, class: User do
    sequence(:niconico_id)
    
    after(:create) do |user|
      3.times{ create(:mylist_template, user: user) }
    end
  end
end

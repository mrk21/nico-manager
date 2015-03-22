FactoryGirl.define do
  factory :user do
    niconico_id 123
  end
  
  factory :user_template, class: User do
    transient do
      mylists_params []
    end
    
    sequence(:niconico_id)
    
    after(:create) do |user, evaluator|
      params = evaluator.mylists_params
      
      if params.empty? then
        3.times{ create(:mylist_template, user: user) }
      else
        params.each do |param|
          create(:mylist_template, param.merge(user: user))
        end
      end
    end
  end
end

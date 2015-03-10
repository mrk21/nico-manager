FactoryGirl.define do
  factory :entry do
    association :mylist, factory: :mylist
    association :video, factory: :video
  end
  
  factory :entry_without_user_creation, class: Entry do
    association :mylist, factory: :mylist_without_user_creation
    association :video, factory: :video
  end
end

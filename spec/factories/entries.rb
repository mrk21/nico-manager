FactoryGirl.define do
  factory :entry do
    association :mylist, factory: :mylist
    association :video, factory: :video
  end
end

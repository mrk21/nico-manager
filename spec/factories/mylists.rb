FactoryGirl.define do
  factory :mylist do
    association :user, factory: :user
    group_id nil
  end
end

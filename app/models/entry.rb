class Entry < ActiveRecord::Base
  belongs_to :mylist
  belongs_to :video
  accepts_nested_attributes_for :video
  
  scope :tagged_with, ->(*args){ joins(:video).merge(Video.tagged_with(*args)) }
end

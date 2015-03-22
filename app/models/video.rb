class Video < ActiveRecord::Base
  acts_as_taggable
  
  validates :video_id, presence: true, uniqueness: true
end

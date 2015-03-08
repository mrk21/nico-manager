class Video < ActiveRecord::Base
  validates :video_id, presence: true, uniqueness: true
end

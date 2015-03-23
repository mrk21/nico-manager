class Entry < ActiveRecord::Base
  belongs_to :mylist
  belongs_to :video
  accepts_nested_attributes_for :video
  
  scope :tagged_with, ->(*args){
    joins(:video).merge(Video.tagged_with(*args))
  }
  
  scope :search, ->(words = nil){
    return all if words.to_s.empty?
    words = words.to_s.split(/\s+/)
    wrap = ->(scope){
      from("(%s) t" % scope.select(:id).to_sql).where('t.id = entries.id')
    }
    
    where('exists (?) OR exists (?)',
      wrap[tagged_with(words)],
      
      wrap[
        joins(:video).instance_eval{
          words.reduce(self){|scope, word|
            scope.where(Video.arel_table[:title].matches("%#{word}%"))
          }
        }
      ]
    )
  }
end

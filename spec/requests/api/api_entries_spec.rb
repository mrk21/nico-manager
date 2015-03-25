require 'rails_helper'

include ActionView::Helpers::SanitizeHelper

module ApiEntriesTest
  def expect_entries(entries)
    
    expect(body).to have_json_size(entries.size)
    
    entries.each_with_index do |entry, i|
      mylist = entry.mylist
      video = entry.video
      
      # mylist
      expect(body).to be_json_eql(mylist.group_id       .to_json).at_path "#{i}/mylist/group_id"
      expect(body).to be_json_eql(mylist.name           .to_json).at_path "#{i}/mylist/name"
      
      # entry
      expect(body).to be_json_eql(entry.item_type       .to_json).at_path "#{i}/entry/item_type"
      expect(body).to be_json_eql(entry.item_id         .to_json).at_path "#{i}/entry/item_id"
      expect(body).to be_json_eql(entry.created_time    .to_json).at_path "#{i}/entry/created_time"
      expect(body).to be_json_eql(entry.description     .to_json).at_path "#{i}/entry/description"
      
      # video
      expect(body).to be_json_eql(video.video_id                .to_json).at_path "#{i}/video/video_id"
      expect(body).to be_json_eql(video.watch_id                .to_json).at_path "#{i}/video/watch_id"
      expect(body).to be_json_eql(video.title                   .to_json).at_path "#{i}/video/title"
      expect(body).to be_json_eql(video.thumbnail_url           .to_json).at_path "#{i}/video/thumbnail_url"
      expect(body).to be_json_eql(video.play_count              .to_json).at_path "#{i}/video/play_count"
      expect(body).to be_json_eql(video.mylist_count            .to_json).at_path "#{i}/video/mylist_count"
      expect(body).to be_json_eql(video.comment_count           .to_json).at_path "#{i}/video/comment_count"
      expect(body).to be_json_eql(video.seconds                 .to_json).at_path "#{i}/video/seconds"
      expect(body).to be_json_eql(video.latest_comment          .to_json).at_path "#{i}/video/latest_comment"
      expect(body).to be_json_eql(strip_tags(video.description) .to_json).at_path "#{i}/video/description"
      expect(body).to be_json_eql(video.group_type              .to_json).at_path "#{i}/video/group_type"
      expect(body).to be_json_eql(video.is_deleting             .to_json).at_path "#{i}/video/is_deleting"
      expect(body).to be_json_eql(video.created_time            .to_json).at_path "#{i}/video/created_time"
    end
  end
end

RSpec.describe "Api::Entries", type: :request do
  include ApiEntriesTest
  
  describe "GET /api/entries" do
    user_traits = [:user_template, mylists_params: [
      entries_params: [
        {video_params: {tag_list: ['a']}},
        {video_params: {tag_list: ['a','b']}},
      ]
    ]]
    
    let(:other_user){ FactoryGirl.create *user_traits }
    before { self.other_user }
    
    authenticated_context(*user_traits) do
      it 'should be all entries of the authenticated user' do
        is_expected.to eq 200
        self.expect_entries(self.current_user.entries)
      end
      
      context 'with search params' do
        let(:params){{q: 'b'}}
        
        it 'should be all entries of the authenticated user matching the search params' do
          is_expected.to eq 200
          self.expect_entries(self.current_user.entries.search(self.params[:q]))
        end
      end
    end
  end
end

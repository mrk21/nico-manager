require 'rails_helper'

RSpec.describe "Api::Entries", type: :request do
  describe "GET /api/entries" do
    let(:entry){ FactoryGirl.create :entry_without_user_creation }
    
    authenticated_context do
      before { self.entry }
      
      it 'should be all entries of the authenticated user' do
        is_expected.to eq 200
        video = self.entry.video
        
        # mylist
        expect(body).to be_json_eql(entry.mylist.group_id .to_json).at_path '0/group_id'
        
        # entry
        expect(body).to be_json_eql(entry.item_type       .to_json).at_path '0/item_type'
        expect(body).to be_json_eql(entry.item_id         .to_json).at_path '0/item_id'
        expect(body).to be_json_eql(entry.created_time    .to_json).at_path '0/created_time'
        expect(body).to be_json_eql(entry.description     .to_json).at_path '0/description'
        
        # video
        expect(body).to be_json_eql(video.video_id        .to_json).at_path '0/video/video_id'
        expect(body).to be_json_eql(video.watch_id        .to_json).at_path '0/video/watch_id'
        expect(body).to be_json_eql(video.title           .to_json).at_path '0/video/title'
        expect(body).to be_json_eql(video.thumbnail_url   .to_json).at_path '0/video/thumbnail_url'
        expect(body).to be_json_eql(video.play_count      .to_json).at_path '0/video/play_count'
        expect(body).to be_json_eql(video.mylist_count    .to_json).at_path '0/video/mylist_count'
        expect(body).to be_json_eql(video.comment_count   .to_json).at_path '0/video/comment_count'
        expect(body).to be_json_eql(video.seconds         .to_json).at_path '0/video/seconds'
        expect(body).to be_json_eql(video.latest_comment  .to_json).at_path '0/video/latest_comment'
        expect(body).to be_json_eql(video.group_type      .to_json).at_path '0/video/group_type'
        expect(body).to be_json_eql(video.is_deleting     .to_json).at_path '0/video/is_deleting'
        expect(body).to be_json_eql(video.created_time    .to_json).at_path '0/video/created_time'
      end
    end
  end
end

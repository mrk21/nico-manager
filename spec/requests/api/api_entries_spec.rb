require 'rails_helper'

RSpec.describe "Api::Entries", type: :request do
  describe "GET /api/entries" do
    let(:entry){ FactoryGirl.create :entry_without_user_creation }
    
    authenticated_context do
      before { self.entry }
      
      it 'should be all entries of the authenticated user' do
        is_expected.to eq 200
        video = self.entry.video
        expect(body).to be_json_eql(video.video_id.to_json).at_path('0/video_id')
        expect(body).to be_json_eql(video.title.to_json).at_path('0/title')
        expect(body).to be_json_eql(video.thumbnail_url.to_json).at_path('0/thumbnail_url')
      end
    end
  end
end

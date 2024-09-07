class Location < ApplicationRecord
  belongs_to :user

  validates :latitude, :longitude, presence: true
  validates :user_id, uniqueness: true
end

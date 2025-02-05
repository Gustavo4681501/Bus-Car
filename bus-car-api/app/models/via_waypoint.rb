class ViaWaypoint < ApplicationRecord
    belongs_to :route, optional: true
end
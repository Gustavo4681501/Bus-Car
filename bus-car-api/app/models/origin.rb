class Origin < ApplicationRecord
    belongs_to :user, optional: true
end
  
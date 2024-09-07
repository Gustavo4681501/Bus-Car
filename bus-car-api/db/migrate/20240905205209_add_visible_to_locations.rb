class AddVisibleToLocations < ActiveRecord::Migration[7.1]
  def change
    add_column :locations, :visible, :boolean
  end
end

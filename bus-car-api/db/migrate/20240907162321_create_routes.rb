class CreateRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :routes do |t|
      t.string :name
      t.text :waypoints

      t.timestamps
    end
  end
end

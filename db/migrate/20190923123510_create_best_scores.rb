class CreateBestScores < ActiveRecord::Migration[5.1]
  def change
    create_table :best_scores do |t|
      t.float :score
      t.references :image
      t.references :user
      
      t.timestamps
    end
  end
end

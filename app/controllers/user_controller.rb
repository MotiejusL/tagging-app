class UserController < ApplicationController
  def new
    user = User.create(name: params[:username])
  end

  def lastid
    if User.last != nil
      lastID = User.last.id
      respond_to do |format|
        format.json {render json: {"lastId" => lastID}}
      end
    end
  end

  def update
    imageId = params["imageId"]
    time = params["time"];
    user = User.find(params[:id]);
    userBestScore = BestScore.find_by(user_id: user.id, image_id: imageId)
    if userBestScore == nil
      BestScore.create(score: time, user_id: user.id, image_id: imageId)
    elsif time.to_i < userBestScore.score
      userBestScore.update_attribute(:score, time)
    end
  end
end

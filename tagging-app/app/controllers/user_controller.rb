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
    id = params["id"];
    time = params["time"];
    user = User.find(id);
    if time.to_i < user.besttime.to_i || user.besttime == nil
      user.update_attribute(:besttime, time)
    end
  end
end

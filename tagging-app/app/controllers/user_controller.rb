class UserController < ApplicationController
  def new
    user = User.create(name: params[:username])
  end

  def lastid
    lastID = User.last.id
    respond_to do |format|
      format.json {render json: {"lastId" => lastID}}
    end
  end

  def update
    id = params["id"];
    time = params["time"];
    user = User.find(id);
    user.update_attribute(:besttime, time)
  end
end

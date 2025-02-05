class Api::OriginsController < ApplicationController
  before_action :set_origin, only: [:show, :update, :destroy]

  # GET /origins
  def index
    @origins = Origin.all
    render json: @origins
  end

  # GET /origins/:id
  def show
    render json: @origin
  end

  # POST /origins
  def create
    @origin = Origin.new(origin_params)

    if @origin.save
      render json: @origin, status: :created, location: api_origin_url(@origin)
    else
      render json: @origin.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /origins/:id
  def update
    if @origin.update(origin_params)
      render json: @origin
    else
      render json: @origin.errors, status: :unprocessable_entity
    end
  end

  # DELETE /origins/:id
  def destroy
    @origin.destroy
    head :no_content
  end

  private

  # Set origin for show, update, and destroy
  def set_origin
    @origin = Origin.find(params[:id])
  end

  # Strong parameters for origin
  def origin_params
    params.require(:origin).permit(:lat, :lng, :route_id)
  end
end

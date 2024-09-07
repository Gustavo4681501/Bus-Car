class Users::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  def new
    super
  end

  # POST /resource/password
  def create
    super
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    token = params[:reset_password_token]
    redirect_to "http://localhost:3001/ResetPassword/#{token}"
  end

  # PUT /resource/password
  def update
    super
  end


   # POST /resource/forgot_password
   def forgot_password
    user = User.find_by(email: params[:email])
    if user
      user.send_reset_password_instructions
      render json: { message: "Reset password instructions sent to #{user.email}" }
    else
      render json: { error: "User not found with email #{params[:email]}" }, status: :not_found
    end
  end

  protected

  def after_resetting_password_path_for(resource)
    super(resource)
  end

  # The path used after sending reset password instructions
  def after_sending_reset_password_instructions_path_for(resource_name)
    super(resource_name)
  end
end

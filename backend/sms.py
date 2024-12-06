from twilio.rest import Client

def send_sms(message, from_number, to_number):
    account_sid = os.environ["TWILIO_ACCOUNT_SID"]
    auth_token = os.environ["TWILIO_AUTH_TOKEN"]
    client = Client(account_sid, auth_token)

    message = client.messages.create(
        from_=from_number,
        body=message,
        to=to_number
    )
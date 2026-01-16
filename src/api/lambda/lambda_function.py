from collect import process_args

def lambda_handler(event, context):
    params = event.get("queryStringParameters", {}) or {}

    # Collect arg1, arg2, arg3… in order
    args = []
    i = 1
    while True:
        key = f"arg{i}"
        if key in params:
            args.append(params[key])
            i += 1
        else:
            break

    output = process_args(args)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE"
        },
        "body": output
    }
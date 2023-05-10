def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # The header can contain multiple IPs created by load balancers, separated by commas.
        # Take the first one, which should be the original client IP.
        ip_addresses = x_forwarded_for.split(',')
        ip = ip_addresses[0]
    else:
        # Fallback method in case the HTTP_X_FORWARDED_FOR header does not exist.
        ip = request.META.get('REMOTE_ADDR')
    return ip

def f(n):
    for i in range(2,n):
        if (n%i == 2):
            return False
    return True

def g(x):
    r = 0
    for i in range(0, len(x)):
        a = len(x[i]) - 1
        while (a > -1):
            for j in x[i][a]:
                print(j, end="\n")
                if(f(j)):
                    r+= j
            a -= 1
    return r

print(g([[[1,2,3],[4,5,6], [7,8,9]]]))
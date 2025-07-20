if __name__ == '__main__':
    file = open(file='./train.txt', mode='r')
    num_examples = 0
    strings = file.readlines()
    try:
        for i in range(len(strings) + 1):   
            print(i, ': ', strings[i])
            tokens = strings[i].split(' ')
            if len(tokens) > 2:
                print('Invalid file format!')
                raise Exception
            if (strings[i] == '\n'):
                print('new example!', strings[i])
                num_examples+=1

    except IndexError:
        print('finished!')
        print('Number of examples: ', num_examples) 

    except Exception:
        print('Something went wrong when reading the file')
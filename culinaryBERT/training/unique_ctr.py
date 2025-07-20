if __name__ == "__main__":
    file = open(file='./train_original.txt', mode='r')
    duplicates = 0

    # All the unique stuff in the file
    unique_examples = []
    curr_example = ''

    positive_examples = 0
    negative_examples = 0
    is_positive = False

    while (True):
        curr_line = file.readline()

        # Done with the file
        if (curr_line == ''):
            break

        if (curr_line != '\n'):
            add_this: list[str] = curr_line.split()
            add_this[0] = str.lower(add_this[0])

            if not is_positive and add_this[1].startswith(('B-', 'I-')):
                is_positive = True

            new_line = " ".join(add_this)
            curr_example += new_line + '\n'
            continue
            
        try:
            # If does not through ValueError it is in the list
            unique_examples.index(curr_example)
            duplicates+=1
            print('It is a duplicate')
        except ValueError:
            print('Unique one found!')
            positive_examples += 1 if is_positive else 0
            negative_examples += 1 if not is_positive else 0
            unique_examples.append(curr_example)
        finally:
            # Reset the example
            curr_example = ''
            is_positive = False

    print('Unique set: ', unique_examples)
    print('Number of unique elements: ', len(unique_examples))
    print('Duplicates: ', duplicates)    
    print('Positive examples: ', positive_examples)
    print('Negative examples: ', negative_examples)

    try:
        with open('./unique_stuff.txt', 'w') as unique_file:
            for i in range(len(unique_examples)):
                unique_example: str = unique_examples[i]
                string_parts = unique_example.split(sep='\n')
                list(map(lambda x: unique_file.write(f'{x}\n'), string_parts))
                # for string in string_parts:
                #     unique_file.write(f'{string}\n')
    except OSError:
        print('Something went wrong with opening the unique_stuff folder!')
        exit()

    print('New file created!')
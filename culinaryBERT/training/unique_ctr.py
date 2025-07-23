if __name__ == "__main__":
    file = open(file='./train_original.txt', mode='r', encoding='utf-8')
    duplicates = 0
    duplicate_examples = []
    borked_examples = []

    # All the unique stuff in the file
    unique_examples = []
    curr_example = ''


    positive_examples = 0
    negative_examples = 0
    borked = 0
    is_positive = False
    skip = False

    line_num = 0
    lines = file.readlines()

    # while (True):
    for line in lines:
        # print(f'About to read line num: {line_num}')
        line_num += 1

        curr_line = line

        # Done with the file
        # if (curr_line == ''):
        #     break

        try:
            if (curr_line != '\n'):
                # Lowercase the example on the current line
                add_this: list[str] = curr_line.split()

                if (len(add_this) != 2):
                    raise ValueError()

                add_this[0] = str.lower(add_this[0])

                # Positive examples only contain non 'O' tags
                if not is_positive and add_this[1].startswith(('B-', 'I-')):
                    is_positive = True

                new_line = " ".join(add_this)

                new_line.strip()
                
                # print("Current new line: ", new_line)

                # Producing safe output
                bytes_line = new_line.encode(encoding='ascii', errors='strict')
                safe_line = bytes_line.decode(encoding='utf-8', errors='strict')

                # print("safe line: ", safe_line)

                curr_example += safe_line + '\n'
                continue
        except UnicodeEncodeError as e:
            # print('borked data found, skipping!')
            borked_examples.append(new_line)
            skip = True
        except ValueError as e:
            print(f'Yo this is cooked (Line num: {line_num}): ', add_this)
            skip = True

        try:
            
            # Skip the borked example
            if (skip):
                borked += 1
                raise Exception

            # If does not throw ValueError it is in the list
            unique_examples.index(curr_example)
            duplicates+=1
            # print(f'Curr example on line ({line_num}): ', curr_example)
            duplicate_examples.append(curr_example)
            # print('It is a duplicate')
        except ValueError:
            # print('Unique one found!')
            positive_examples += 1 if is_positive else 0
            negative_examples += 1 if not is_positive else 0
            unique_examples.append(curr_example)
        except Exception:
            # print('Skipping example')
            pass
        finally:
            # Reset the example
            curr_example = ''
            is_positive = False
            skip = False

    # print('Unique set: ', unique_examples)
    print('Number of unique elements: ', len(unique_examples))
    print(f'Duplicates : {duplicates}')    
    print('Positive examples: ', positive_examples)
    print('Negative examples: ', negative_examples)
    print('Borked: ', borked)
    print('Borked Stuff:', borked_examples)

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
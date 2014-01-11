//
//  MobileViewController.m
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import "MobileViewController.h"
#import "EditViewController.h"
#import "ActionType.h"

@interface MobileViewController () <UITableViewDataSource, UITableViewDelegate>
@property (weak, nonatomic) IBOutlet UITableView *actionTableView;

@end

@implementation MobileViewController

- (void)awakeFromNib
{
    self.actionTableView.delegate = self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
//    [self.actionTableView reloadData];
//    CGRect frame = self.actionTableView.frame;
//    frame.size.height = self.actionTableView.contentSize.height;
//    self.actionTableView.frame = frame;

}

- (void)viewWillAppear:(BOOL)animated {
    [self.actionTableView reloadData];
//    self.actionTableView.frame = CGRectMake(
//                                            self.actionTableView.frame.origin.x,
//                                            self.actionTableView.frame.origin.y,
//                                            self.actionTableView.frame.size.width,
//                                            self.actionTableView.contentSize.height
//                                            );
}

- (void)reloadTable {
    [self.actionTableView reloadData];
}


#pragma mark - UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return [self.logger.actionTypes count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Adding Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    // Configure the cell.
    ActionType *actionType = self.logger.actionTypes[indexPath.row];
    cell.textLabel.text = [actionType getTitle];
    cell.detailTextLabel.text = [NSString stringWithFormat:@"%@%@", [self.logger.totalCounts[actionType.type] stringValue], [actionType unitForCount]];
    cell.imageView.image = [UIImage imageNamed:actionType.imageName];
    
    return cell;
}


#pragma mark - Navigation

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
    if ([sender isKindOfClass:[UITableViewCell class]]) {
        NSIndexPath *indexPath = [self.actionTableView indexPathForCell:sender];
        if (indexPath) {
            if ([segue.identifier isEqualToString:@"Add Action"]) {
                if ([segue.destinationViewController isKindOfClass:[EditViewController class]]) {
                    EditViewController *evc = segue.destinationViewController;
                    ActionType *actionType = self.logger.actionTypes[indexPath.row];
                    evc.title = [NSString stringWithFormat:@"Add %@", [actionType getTitle]];
                    evc.logger = self.logger;
                    evc.actionType = actionType;
                }
            }
        }
    }
}

@end

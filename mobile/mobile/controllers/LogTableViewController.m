//
//  LogTableViewController.m
//  mobile
//
//  Created by Lauri Raivio on 7.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import "LogTableViewController.h"
#import "Action.h"
#import "EditViewController.h"

@interface LogTableViewController ()

@end

@implementation LogTableViewController

- (void)setActions:(NSDictionary *)actions
{
    _actions = actions;
}

- (void)viewWillAppear:(BOOL)animated {
    self.actionKeys = [self.logger sortedActionKeys];
    self.actions = [self.logger sortedActions];
    [self.tableView reloadData];
}


- (IBAction)fakeRefresh:(UIRefreshControl *)sender
{
    [sender beginRefreshing];
    sleep(0.85);
    [sender endRefreshing];
}

#pragma mark - UITableViewDataSource

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return [self.actionKeys count];
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    NSString *key = self.actionKeys[section];
    return [self.actions[key] count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"Action Cell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    
    // Configure the cell.
    NSString *key = self.actionKeys[indexPath.section];
    Action *action = self.actions[key][indexPath.row];
    
    cell.textLabel.text = action.logTitle;
    cell.detailTextLabel.text = action.getCreatedAtTime;
    cell.imageView.image = [UIImage imageNamed:action.type.imageName];
    
    return cell;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section
{
    return self.actionKeys[section];
}

#pragma mark - Navigation

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
    if ([sender isKindOfClass:[UITableViewCell class]]) {
        NSIndexPath *indexPath = [self.tableView indexPathForCell:sender];
        if (indexPath) {
            if ([segue.identifier isEqualToString:@"Edit Action"]) {
                if ([segue.destinationViewController isKindOfClass:[EditViewController class]]) {
                    EditViewController *evc = segue.destinationViewController;

                    NSString *key = self.actionKeys[indexPath.section];
                    Action *action = self.actions[key][indexPath.row];
                    ActionType *actionType = action.type;

                    evc.title = [NSString stringWithFormat:@"Edit %@", [actionType getTitle]];
                    evc.logger = self.logger;
                    evc.actionType = actionType;
                    evc.action = action;
                }
            }
        }
    }
}


/*
// Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    return YES;
}
*/

/*
// Override to support editing the table view.
- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete) {
        // Delete the row from the data source
        [tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationFade];
    }   
    else if (editingStyle == UITableViewCellEditingStyleInsert) {
        // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
    }   
}
*/

/*
// Override to support rearranging the table view.
- (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
{
}
*/

/*
// Override to support conditional rearranging of the table view.
- (BOOL)tableView:(UITableView *)tableView canMoveRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the item to be re-orderable.
    return YES;
}
*/

/*
#pragma mark - Navigation

// In a story board-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}

 */

@end
